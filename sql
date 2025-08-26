-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.blogs (
  id bigint NOT NULL DEFAULT nextval('blogs_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  excerpt text,
  content text,
  cover_image character varying,
  author_id bigint,
  tags ARRAY,
  status character varying DEFAULT 'draft'::character varying,
  views_count bigint DEFAULT 0,
  likes_count bigint DEFAULT 0,
  CONSTRAINT blogs_pkey PRIMARY KEY (id),
  CONSTRAINT blogs_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id)
);
CREATE TABLE public.careers (
  id bigint NOT NULL DEFAULT nextval('careers_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  image character varying,
  agency_name character varying,
  type character varying,
  address text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  position character varying,
  description text,
  technology_id bigint,
  CONSTRAINT careers_pkey PRIMARY KEY (id),
  CONSTRAINT careers_technology_id_fkey FOREIGN KEY (technology_id) REFERENCES public.technology(id)
);
CREATE TABLE public.certificates (
  id bigint NOT NULL DEFAULT nextval('cerfificates_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  image character varying,
  time timestamp with time zone,
  CONSTRAINT certificates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contacts (
  id bigint NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  username character varying,
  link character varying,
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
CREATE TABLE public.projects (
  id bigint NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  title character varying NOT NULL,
  image character varying,
  description text,
  list_pekerjaan ARRAY,
  url_github character varying,
  url_demo character varying,
  technology_id bigint,
  slug character varying NOT NULL UNIQUE,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_technology_id_fkey FOREIGN KEY (technology_id) REFERENCES public.technology(id)
);
CREATE TABLE public.services (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying,
  hashtag character varying,
  description text,
  CONSTRAINT services_pkey PRIMARY KEY (id)
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
  CONSTRAINT users_pkey PRIMARY KEY (id)
);







CONTACT (DONE)
PROJECTS
CAREERS 
SERVICES (DONE)
TECHNOLOGY (DONE)
SOFT_SKILLS (DONE)
EDUCATIONS 
BLOGS 
CERTFICATES (DONE)
USERS (DONE)