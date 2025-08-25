const supabase = require('../config/supabase');

class TechnologyModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('technology')
            .select('*');
        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('technology')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async create({
        name,
        image
    }) {
        const {
            data,
            error
        } = await supabase
            .from('technology')
            .insert([{
                name,
                image
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, {
        name,
        image
    }) {
        const {
            data,
            error
        } = await supabase
            .from('technology')
            .update({
                name,
                image
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
            .from('technology')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
}

module.exports = TechnologyModel;
