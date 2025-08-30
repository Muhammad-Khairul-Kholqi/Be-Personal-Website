const supabase = require('../config/supabase');

class SkillsModel {
    static async getAll() {
        const {
            data,
            error
        } = await supabase
            .from('skills')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const {
            data,
            error
        } = await supabase
            .from('skills')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async create({
        name
    }) {
        const {
            data,
            error
        } = await supabase
            .from('skills')
            .insert([{
                name
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    static async update(id, {
        name
    }) {
        const {
            data,
            error
        } = await supabase
            .from('skills')
            .update({
                name
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
            .from('skills')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    // Methods for user-skills relationship
    static async getUserSkills(userId) {
        const {
            data,
            error
        } = await supabase
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
        return data.map(item => item.skills);
    }

    static async addUserSkill(userId, skillId) {
        const {
            data,
            error
        } = await supabase
            .from('user_skills')
            .insert([{
                user_id: userId,
                skill_id: skillId
            }])
            .select();
        if (error) throw error;
        return data;
    }

    static async removeUserSkill(userId, skillId) {
        const {
            error
        } = await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', userId)
            .eq('skill_id', skillId);
        if (error) throw error;
    }

    static async updateUserSkills(userId, skillIds) {
        // Remove all existing skills for user
        await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', userId);

        // Add new skills if any
        if (skillIds && skillIds.length > 0) {
            const skillsToInsert = skillIds.map(skillId => ({
                user_id: userId,
                skill_id: skillId
            }));

            const {
                error
            } = await supabase
                .from('user_skills')
                .insert(skillsToInsert);
            if (error) throw error;
        }
    }
}

module.exports = SkillsModel;