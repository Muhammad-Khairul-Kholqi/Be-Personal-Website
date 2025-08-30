const supabase = require('../config/supabase');

class EducationModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('educations')
            .select('*')
            .order('created_at', {
                ascending: false
            });
        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('educations')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async create(payload) {
        const {
            data,
            error
        } = await supabase
            .from('educations')
            .insert(payload)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, payload) {
        const {
            data,
            error
        } = await supabase
            .from('educations')
            .update(payload)
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
            .from('educations')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
}

module.exports = EducationModel;
