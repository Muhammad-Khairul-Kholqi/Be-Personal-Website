const supabase = require('../config/supabase');

class SkillsModel {
    static async getAll() {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async getUserSkills(userId) {
        const { data, error } = await supabase
            .from('user_skills')
            .select(`
                skill_id,
                skills (
                    id,
                    name
                )
            `)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        return data.map(item => ({
            id: item.skills.id,
            name: item.skills.name
        }));
    }

    static async updateUserSkills(userId, skillIds) {
        
        const { error: deleteError } = await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', userId);
        
        if (deleteError) throw deleteError;

        if (skillIds && skillIds.length > 0) {
            const userSkillsData = skillIds.map(skillId => ({
                user_id: userId,
                skill_id: skillId
            }));

            const { error: insertError } = await supabase
                .from('user_skills')
                .insert(userSkillsData);
            
            if (insertError) throw insertError;
        }

        return true;
    }

    static async create(name) {
        const { data, error } = await supabase
            .from('skills')
            .insert({ name })
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, name) {
        const { data, error } = await supabase
            .from('skills')
            .update({ name })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async delete(id) {
        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
}

module.exports = SkillsModel;