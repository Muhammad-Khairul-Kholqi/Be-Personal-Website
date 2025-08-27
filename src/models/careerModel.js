const supabase = require('../config/supabase');

class CareerModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('careers')
            .select(`
                *,
                career_technologies (
                    technology (*)
                )
            `);

        if (error) throw error;

        const transformedData = data.map(career => ({
            ...career,
            technologies: career.career_technologies ?.map(ct => ct.technology) || []
        }));

        return transformedData.map(({
            career_technologies,
            ...career
        }) => career);
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('careers')
            .select(`
                *,
                career_technologies (
                    technology (*)
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        const transformedData = {
            ...data,
            technologies: data.career_technologies ?.map(ct => ct.technology) || []
        };

        const {
            career_technologies,
            ...career
        } = transformedData;
        return career;
    }

    static async create({
        agency_name,
        type,
        address,
        start_time,
        end_time,
        position,
        job_list,
        image,
        technology_ids 
    }) {
        const {
            data: careerData,
            error: careerError
        } = await supabase
            .from('careers')
            .insert([{
                agency_name,
                type,
                address,
                start_time,
                end_time,
                position,
                job_list,
                image
            }])
            .select()
            .single();

        if (careerError) throw careerError;

        if (technology_ids && technology_ids.length > 0) {
            const careerTechnologies = technology_ids.map(tech_id => ({
                career_id: careerData.id,
                technology_id: tech_id
            }));

            const {
                error: relationError
            } = await supabase
                .from('career_technologies')
                .insert(careerTechnologies);

            if (relationError) throw relationError;
        }

        return careerData;
    }

    static async update(id, {
        agency_name,
        type,
        address,
        start_time,
        end_time,
        position,
        job_list,
        image,
        technology_ids 
    }) {
        const updateData = {};
        if (agency_name !== undefined) updateData.agency_name = agency_name;
        if (type !== undefined) updateData.type = type;
        if (address !== undefined) updateData.address = address;
        if (start_time !== undefined) updateData.start_time = start_time;
        if (end_time !== undefined) updateData.end_time = end_time;
        if (position !== undefined) updateData.position = position;
        if (job_list !== undefined) updateData.job_list = job_list;
        if (image !== undefined) updateData.image = image;

        const {
            data: careerData,
            error: careerError
        } = await supabase
            .from('careers')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (careerError) throw careerError;

        if (technology_ids !== undefined) {
            // Hapus relasi lama
            await supabase
                .from('career_technologies')
                .delete()
                .eq('career_id', id);

            if (technology_ids.length > 0) {
                const careerTechnologies = technology_ids.map(tech_id => ({
                    career_id: id,
                    technology_id: tech_id
                }));

                const {
                    error: relationError
                } = await supabase
                    .from('career_technologies')
                    .insert(careerTechnologies);

                if (relationError) throw relationError;
            }
        }

        return careerData;
    }

    static async delete(id) {
        await supabase
            .from('career_technologies')
            .delete()
            .eq('career_id', id);

        const {
            error
        } = await supabase
            .from('careers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}

module.exports = CareerModel;
