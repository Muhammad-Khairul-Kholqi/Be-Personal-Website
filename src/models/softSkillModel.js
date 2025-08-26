const supabase = require('../config/supabase');

class SoftSkillModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('soft_skills')
            .select('*');
        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('soft_skills')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async create({
        title,
        description,
    }) {
        const {
            data,
            error
        } = await supabase
            .from('soft_skills')
            .insert([{
                title,
                description,
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, {
        title,
        description,
    }) {
        const {
            data,
            error
        } = await supabase
            .from('soft_skills')
            .update({
                title,
                description,
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async delete(id) {
        const {
            error
        } = await supabase
            .from('soft_skills')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}

module.exports = SoftSkillModel;