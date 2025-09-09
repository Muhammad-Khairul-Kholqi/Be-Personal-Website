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
                ),
                project_images (
                    id,
                    image_url,
                    image_order,
                    is_primary
                )
            `)
            .order('created_at', {
                ascending: false
            });

        if (error) throw error;

        return data.map(project => ({
            ...project,
            technologies: project.project_technologies ?.map(ct => ct.technology) || [],
            images: project.project_images ?.sort((a, b) => a.image_order - b.image_order) || [],
            primary_image: project.project_images ?.find(img => img.is_primary) ?.image_url ||
                project.project_images ?. [0] ?.image_url ||
                project.image || null
        })).map(({
            project_technologies,
            project_images,
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
                ),
                project_images (
                    id,
                    image_url,
                    image_order,
                    is_primary
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        const transformedData = {
            ...data,
            technologies: data.project_technologies ?.map(ct => ct.technology) || [],
            images: data.project_images ?.sort((a, b) => a.image_order - b.image_order) || [],
            primary_image: data.project_images ?.find(img => img.is_primary) ?.image_url ||
                data.project_images ?. [0] ?.image_url ||
                data.image || null
        };

        const {
            project_technologies,
            project_images,
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
        status,
        technology_ids,
        images = []
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
                status
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

        if (images && images.length > 0) {
            const projectImages = images.map((imageUrl, index) => ({
                project_id: projectData.id,
                image_url: imageUrl,
                image_order: index + 1,
                is_primary: index === 0
            }));

            const {
                error: imageError
            } = await supabase
                .from('project_images')
                .insert(projectImages);

            if (imageError) throw imageError;
        }

        return projectData;
    }

    static async update(id, {
        title,
        description,
        list_job,
        url_github,
        url_demo,
        status,
        technology_ids,
        images
    }) {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (list_job !== undefined) updateData.list_job = list_job;
        if (url_github !== undefined) updateData.url_github = url_github;
        if (url_demo !== undefined) updateData.url_demo = url_demo;
        if (status !== undefined) updateData.status = status;

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

        if (images !== undefined) {
            const {
                data: existingImages
            } = await supabase
                .from('project_images')
                .select('image_url')
                .eq('project_id', id);

            await supabase
                .from('project_images')
                .delete()
                .eq('project_id', id);

            if (existingImages && existingImages.length > 0) {
                const imagesToDelete = existingImages
                    .filter(img => img.image_url && img.image_url.includes('/storage/v1/object/public/project-images/'))
                    .map(img => {
                        const parts = img.image_url.split('/project-images/');
                        return parts.length > 1 ? parts[1] : null;
                    })
                    .filter(Boolean);

                if (imagesToDelete.length > 0) {
                    await supabase.storage.from('project-images').remove(imagesToDelete);
                }
            }

            if (images.length > 0) {
                const projectImages = images.map((imageUrl, index) => ({
                    project_id: id,
                    image_url: imageUrl,
                    image_order: index + 1,
                    is_primary: index === 0
                }));

                const {
                    error: imageError
                } = await supabase
                    .from('project_images')
                    .insert(projectImages);

                if (imageError) throw imageError;
            }
        }

        return projectData;
    }

    static async delete(id) {
        const {
            data: projectImages
        } = await supabase
            .from('project_images')
            .select('image_url')
            .eq('project_id', id);

        if (projectImages && projectImages.length > 0) {
            const imagesToDelete = projectImages
                .filter(img => img.image_url && img.image_url.includes('/storage/v1/object/public/project-images/'))
                .map(img => {
                    const parts = img.image_url.split('/project-images/');
                    return parts.length > 1 ? parts[1] : null;
                })
                .filter(Boolean);

            if (imagesToDelete.length > 0) {
                await supabase.storage.from('project-images').remove(imagesToDelete);
            }
        }

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