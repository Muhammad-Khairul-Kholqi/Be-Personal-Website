const supabase = require('../config/supabase');

class ContactModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('contacts')
            .select('*');
        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('contacts')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async create({
        title,
        link,
        icon
    }) {
        const {
            data,
            error
        } = await supabase
            .from('contacts')
            .insert([{
                title,
                link,
                icon
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, {
        title,
        link,
        icon
    }) {
        const {
            data,
            error
        } = await supabase
            .from('contacts')
            .update({
                title,
                link,
                icon
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
            .from('contacts')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}

module.exports = ContactModel;