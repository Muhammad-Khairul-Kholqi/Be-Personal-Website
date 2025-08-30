-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.blogs (
  id bigint NOT NULL DEFAULT nextval('blogs_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  excerpt text,
  content text,
  cover_image character varying,
  author_id bigint,
  tags ARRAY,
  status USER-DEFINED DEFAULT 'process'::blog_status,
  views_count bigint DEFAULT 0,
  likes_count bigint DEFAULT 0,
  type USER-DEFINED DEFAULT 'frontend'::blog_type,
  CONSTRAINT blogs_pkey PRIMARY KEY (id),
  CONSTRAINT blogs_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id)
);
CREATE TABLE public.career_technologies (
  id bigint NOT NULL DEFAULT nextval('career_technologies_id_seq'::regclass),
  career_id bigint NOT NULL,
  technology_id bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT career_technologies_pkey PRIMARY KEY (id),
  CONSTRAINT career_technologies_technology_id_fkey FOREIGN KEY (technology_id) REFERENCES public.technology(id),
  CONSTRAINT career_technologies_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);
CREATE TABLE public.careers (
  id bigint NOT NULL DEFAULT nextval('careers_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  image character varying,
  agency_name character varying,
  type USER-DEFINED DEFAULT 'full_time'::status_type,
  address text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  position character varying,
  job_list text,
  CONSTRAINT careers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.certificates (
  id bigint NOT NULL DEFAULT nextval('cerfificates_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  image character varying,
  time timestamp with time zone,
  company character varying,
  CONSTRAINT certificates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contacts (
  id bigint NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  link character varying,
  icon character varying,
  username character varying,
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.educations (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  school_name character varying,
  image character varying,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  CONSTRAINT educations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.project_technologies (
  id bigint NOT NULL DEFAULT nextval('project_technologies_id_seq'::regclass),
  project_id bigint NOT NULL,
  technology_id bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_technologies_pkey PRIMARY KEY (id),
  CONSTRAINT project_technologies_technology_id_fkey FOREIGN KEY (technology_id) REFERENCES public.technology(id),
  CONSTRAINT project_technologies_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.projects (
  id bigint NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  image character varying,
  description text,
  url_github character varying,
  url_demo character varying,
  list_job text,
  status USER-DEFINED,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.services (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying,
  hashtag character varying,
  description text,
  icon character varying,
  CONSTRAINT services_pkey PRIMARY KEY (id)
);
CREATE TABLE public.skills (
  id bigint NOT NULL DEFAULT nextval('skills_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT skills_pkey PRIMARY KEY (id)
);
CREATE TABLE public.soft_skills (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying,
  description text,
  CONSTRAINT soft_skills_pkey PRIMARY KEY (id)
);
CREATE TABLE public.technology (
  id bigint NOT NULL DEFAULT nextval('technology_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  image character varying,
  CONSTRAINT technology_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_skills (
  user_id bigint NOT NULL,
  skill_id bigint NOT NULL,
  CONSTRAINT user_skills_pkey PRIMARY KEY (user_id, skill_id),
  CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id),
  CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  fullname character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  image character varying,
  username character varying,
  description text,
  address text,
  resume character varying,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);







CONTACT (DONE)
PROJECTS (DONE)
CAREERS (DONE)
SERVICES (DONE)
TECHNOLOGY (DONE)
SOFT_SKILLS (DONE)
EDUCATIONS 
BLOGS 
CERTFICATES (DONE)
USERS (tinggal edit profle)
























// models/skillsModel.js


// controllers/skillsController.js


// routes/skillsRoutes.js


// Updated AuthController with Skills Integration
