const supabase = require('../config/supabase');

class UserModel {
    static async getByEmail(email) {
        const {
            data,
            error
        } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, payload) {
        const {
            data,
            error
        } = await supabase
            .from('users')
            .update(payload)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

module.exports = UserModel;
