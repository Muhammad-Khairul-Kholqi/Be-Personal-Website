const supabase = require('../config/supabase');

class ServicesModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('services')
            .select('*');
        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async create({
        title,
        hashtag,
        description,
        icon
    }) {
        const {
            data,
            error
        } = await supabase
            .from('services')
            .insert([{
                title,
                hashtag,
                description,
                icon
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, {
        title,
        hashtag,
        description,
        icon
    }) {
        const {
            data,
            error
        } = await supabase
            .from('services')
            .update({
                title,
                hashtag,
                description
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
            .from('services')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}

module.exports = ServicesModel;