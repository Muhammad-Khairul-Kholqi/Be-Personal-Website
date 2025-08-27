const supabase = require('../config/supabase');

class ProjectModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('projects')
            .select(`
                *,
                project_technologies (
                    technology (*)
                )
            `);

        if (error) throw error;

        const transformedData = data.map(project => ({
            ...project,
            technologies: project.project_technologies ?.map(ct => ct.technology) || []
        }));

        return transformedData.map(({
            project_technologies,
            ...project
        }) => project);
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('projects')
            .select(`
                *,
                project_technologies (
                    technology (*)
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        const transformedData = {
            ...data,
            technologies: data.project_technologies ?.map(ct => ct.technology) || []
        };

        const {
            project_technologies,
            ...project
        } = transformedData;
        return project;
    }

    static async create({
        title,
        description,
        list_job,
        url_github,
        url_demo,
        image,
        technology_ids 
    }) {
        const {
            data: projectData,
            error: projectError
        } = await supabase
            .from('projects')
            .insert([{
                title,
                description,
                list_job,
                url_github,
                url_demo,
                image,
            }])
            .select()
            .single();

        if (projectError) throw projectError;

        if (technology_ids && technology_ids.length > 0) {
            const projectTechnologies = technology_ids.map(tech_id => ({
                project_id: projectData.id,
                technology_id: tech_id
            }));

            const {
                error: relationError
            } = await supabase
                .from('project_technologies')
                .insert(projectTechnologies);

            if (relationError) throw relationError;
        }

        return projectData;
    }

    static async update(id, {
        title,
        description,
        list_job,
        url_github,
        url_demo,
        image,
        technology_ids 
    }) {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (list_job !== undefined) updateData.list_job = list_job;
        if (url_github !== undefined) updateData.url_github = url_github;
        if (url_demo !== undefined) updateData.url_demo = url_demo;
        if (image !== undefined) updateData.image = image;

        const {
            data: projectData,
            error: projectError
        } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (projectError) throw projectError;

        if (technology_ids !== undefined) {
            await supabase
                .from('project_technologies')
                .delete()
                .eq('project_id', id);

            if (technology_ids.length > 0) {
                const projectTechnologies = technology_ids.map(tech_id => ({
                    project_id: id,
                    technology_id: tech_id
                }));

                const {
                    error: relationError
                } = await supabase
                    .from('project_technologies')
                    .insert(projectTechnologies);

                if (relationError) throw relationError;
            }
        }

        return projectData;
    }

    static async delete(id) {
        await supabase
            .from('project_technologies')
            .delete()
            .eq('project_id', id);

        const {
            error
        } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}

module.exports = ProjectModel;
