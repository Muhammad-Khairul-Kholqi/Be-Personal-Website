const supabase = require('../config/supabase');

class CertificateModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('certificates')
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
            .from('certificates')
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
            .from('certificates')
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
            .from('certificates')
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
            .from('certificates')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
}

module.exports = CertificateModel;
