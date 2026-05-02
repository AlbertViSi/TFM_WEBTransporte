--
-- PostgreSQL database dump
--

\restrict X8S8dg76f1ukKVops8NTAelH5BAIfWFUkYIqJjF1VWlZyhmrgdxH40VvmjjcEGa

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-01 13:20:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: bans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bans (
    id integer NOT NULL,
    dni_encrypted text CONSTRAINT bans_dni_hash_not_null NOT NULL,
    reason text,
    status character varying(15) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone,
    CONSTRAINT bans_status_check CHECK (((status)::text = ANY (ARRAY[('activo'::character varying)::text, ('expirado'::character varying)::text, ('permanente'::character varying)::text])))
);


ALTER TABLE public.bans OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16400)
-- Name: bans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.bans ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    route_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16412)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 16413)
-- Name: node_distances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.node_distances (
    id integer NOT NULL,
    node_a integer NOT NULL,
    node_b integer NOT NULL,
    distance_km numeric(10,2) NOT NULL
);


ALTER TABLE public.node_distances OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16420)
-- Name: node_distances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.node_distances ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.node_distances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 16421)
-- Name: nodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nodes (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    node_type character varying(10) NOT NULL,
    parent_node_id integer,
    CONSTRAINT nodes_node_type_check CHECK (((node_type)::text = ANY (ARRAY[('main'::character varying)::text, ('sub'::character varying)::text])))
);


ALTER TABLE public.nodes OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16430)
-- Name: nodes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.nodes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.nodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 16431)
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    route_id integer NOT NULL,
    rating integer NOT NULL,
    CONSTRAINT ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16439)
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ratings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 16440)
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id integer NOT NULL,
    user_id integer,
    route_id integer NOT NULL,
    dni_encrypted text CONSTRAINT reservations_dni_hash_not_null NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status character varying(15) NOT NULL,
    departure_date timestamp without time zone NOT NULL,
    origin_node_id integer,
    destination_node_id integer,
    CONSTRAINT reservations_status_check CHECK (((status)::text = ANY (ARRAY[('pendiente'::character varying)::text, ('completado'::character varying)::text, ('cancelado'::character varying)::text])))
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16452)
-- Name: reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reservations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reservations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 16453)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16458)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 16459)
-- Name: route_nodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.route_nodes (
    id integer NOT NULL,
    route_id integer NOT NULL,
    node_id integer NOT NULL,
    node_order integer NOT NULL
);


ALTER TABLE public.route_nodes OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16466)
-- Name: route_nodes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.route_nodes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.route_nodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 16467)
-- Name: routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routes (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    status character varying(10) DEFAULT 'activo'::character varying NOT NULL,
    base_price numeric(10,2) NOT NULL,
    capacity integer DEFAULT 50,
    CONSTRAINT routes_status_check CHECK (((status)::text = ANY (ARRAY[('activo'::character varying)::text, ('inactivo'::character varying)::text])))
);


ALTER TABLE public.routes OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16477)
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.routes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.routes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 16478)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16486)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5014 (class 0 OID 16390)
-- Dependencies: 219
-- Data for Name: bans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bans (id, dni_encrypted, reason, status, created_at, expires_at) FROM stdin;
2	1af00d5c1d15aaf7e648709eb5490067:8c31868790bf8ad941972e5c646855ee	Mal comportamiento	activo	2026-04-19 21:01:06.585944	2026-10-28 00:00:00
\.


--
-- TOC entry 5016 (class 0 OID 16401)
-- Dependencies: 221
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, user_id, route_id, content, created_at) FROM stdin;
1	2	1	Muy c├│modo y puntual	2026-04-16 11:50:34.048194
2	3	1	Buen servicio, repetir├¡a	2026-04-16 11:50:34.048194
3	4	1	Correcto, pero mejorable	2026-04-16 11:50:34.048194
4	2	1	prueba	2026-04-19 15:19:11.236723
5	2	1	prueba 2	2026-04-19 15:28:33.119579
6	2	1	prueba 3	2026-04-19 15:29:43.918811
\.


--
-- TOC entry 5018 (class 0 OID 16413)
-- Dependencies: 223
-- Data for Name: node_distances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.node_distances (id, node_a, node_b, distance_km) FROM stdin;
1	1	2	225.27
2	2	3	236.04
3	3	4	116.13
4	4	5	352.30
5	5	6	303.06
6	6	7	176.86
7	7	8	235.58
8	8	9	212.39
9	5	13	256.21
10	13	14	272.94
11	14	15	160.23
12	14	17	223.46
13	17	7	128.17
\.


--
-- TOC entry 5020 (class 0 OID 16421)
-- Dependencies: 225
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nodes (id, name, latitude, longitude, node_type, parent_node_id) FROM stdin;
1	Santiago de Compostela	42.878200	-8.544800	main	\N
2	Oviedo	43.361900	-5.849400	main	\N
3	Bilbao	43.263000	-2.935000	main	\N
4	Pamplona	42.812500	-1.645800	main	\N
5	Barcelona	41.387400	2.168600	main	\N
6	Valencia	39.469900	-0.376300	main	\N
7	Murcia	37.992200	-1.130700	main	\N
8	Granada	37.177300	-3.598600	main	\N
9	Sevilla	37.389100	-5.984500	main	\N
10	Leon	42.598700	-5.567100	main	\N
11	Salamanca	40.970100	-5.663500	main	\N
12	Caceres	39.476500	-6.372200	main	\N
13	Zaragoza	41.648800	-0.889100	main	\N
14	Madrid	40.416800	-3.703800	main	\N
15	Ciudad Real	38.986100	-3.927300	main	\N
16	Cordoba	37.888200	-4.779400	main	\N
17	Albacete	38.994300	-1.858500	main	\N
24	Estacion Autobuses Terrassa	41.562962	2.010049	sub	5
25	Ayuntamiento Toledo	39.855891	-4.024265	sub	14
\.


--
-- TOC entry 5022 (class 0 OID 16431)
-- Dependencies: 227
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, user_id, route_id, rating) FROM stdin;
2	3	1	4
3	4	1	3
1	2	1	4
\.


--
-- TOC entry 5024 (class 0 OID 16440)
-- Dependencies: 229
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, user_id, route_id, dni_encrypted, total_price, status, departure_date, origin_node_id, destination_node_id) FROM stdin;
5	2	1	0cf7b4865f95254fdf4b00fed46f815d:8b182bdcd66d9f1eb526e702a31faf6c	11.61	pendiente	2026-04-23 02:00:00	3	4
4	2	1	abb3a06dc0f29e62e594001764920fd8:b9af1a92e0cff42c274ab9ca9d170762	46.84	completado	2026-04-19 02:00:00	5	3
\.


--
-- TOC entry 5026 (class 0 OID 16453)
-- Dependencies: 231
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	user
3	moderator
4	node_builder
\.


--
-- TOC entry 5028 (class 0 OID 16459)
-- Dependencies: 233
-- Data for Name: route_nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.route_nodes (id, route_id, node_id, node_order) FROM stdin;
1	1	1	1
2	1	2	2
3	1	3	3
4	1	4	4
5	1	5	5
6	2	5	1
7	2	6	2
8	2	7	3
9	2	8	4
10	2	9	5
11	3	9	4
12	3	11	2
13	4	5	1
14	4	13	2
15	4	14	3
16	4	15	4
17	5	1	1
18	5	7	5
19	5	14	3
20	5	17	4
\.


--
-- TOC entry 5030 (class 0 OID 16467)
-- Dependencies: 235
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routes (id, name, status, base_price, capacity) FROM stdin;
1	Norte	activo	1.00	50
2	Sur	activo	1.00	50
3	Oeste	activo	1.00	50
4	Central EO	activo	1.00	50
5	OE	activo	1.00	50
6	Norte B	activo	1.00	50
7	Sur B	activo	1.00	50
8	Oeste B	activo	1.00	50
9	Central EO B	activo	1.00	50
10	OE B	activo	1.00	50
\.


--
-- TOC entry 5032 (class 0 OID 16478)
-- Dependencies: 237
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, role_id) FROM stdin;
1	admin	admin@admin.com	$2b$10$CCvjI67OuHOvOlEOQ9tHbeJvmMqYJeh2002.dNiD0yfw6SB.I1q/K	1
2	user1	user1@user1.com	$2b$10$pDcHX4JIjNys2sDRZ681AumsQxggToYzDv4w/kAFaqGgX.RXLCYVO	2
3	user2	user2@user2.com	$2b$10$fdYi4jghbN/3R4WtawoeYuRtmMPYdEA8Uc5grW9PizeYpOlKYck9e	2
4	user3	user3@user3.com	$2b$10$GM53e7ndGQZhFQ/p4fk8zuMe.Li9qZ5LUOo3N1sfDMCj1v8JI3Xyi	2
\.


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 220
-- Name: bans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bans_id_seq', 3, true);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 222
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 6, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 224
-- Name: node_distances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.node_distances_id_seq', 13, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 226
-- Name: nodes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nodes_id_seq', 25, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 228
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 6, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 230
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_seq', 5, true);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 232
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 234
-- Name: route_nodes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.route_nodes_id_seq', 20, true);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 236
-- Name: routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.routes_id_seq', 10, true);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 238
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4810 (class 2606 OID 16488)
-- Name: bans bans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bans
    ADD CONSTRAINT bans_pkey PRIMARY KEY (id);


--
-- TOC entry 4812 (class 2606 OID 16490)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 16492)
-- Name: node_distances node_distances_node_a_node_b_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.node_distances
    ADD CONSTRAINT node_distances_node_a_node_b_key UNIQUE (node_a, node_b);


--
-- TOC entry 4819 (class 2606 OID 16494)
-- Name: node_distances node_distances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.node_distances
    ADD CONSTRAINT node_distances_pkey PRIMARY KEY (id);


--
-- TOC entry 4821 (class 2606 OID 16496)
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 16498)
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 16500)
-- Name: ratings ratings_user_id_route_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_route_id_key UNIQUE (user_id, route_id);


--
-- TOC entry 4834 (class 2606 OID 16502)
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16504)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4838 (class 2606 OID 16506)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16508)
-- Name: route_nodes route_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_nodes
    ADD CONSTRAINT route_nodes_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 16510)
-- Name: route_nodes route_nodes_route_id_node_order_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_nodes
    ADD CONSTRAINT route_nodes_route_id_node_order_key UNIQUE (route_id, node_order);


--
-- TOC entry 4846 (class 2606 OID 16512)
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 16514)
-- Name: nodes unique_node_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT unique_node_name UNIQUE (name);


--
-- TOC entry 4830 (class 2606 OID 16516)
-- Name: ratings unique_user_route; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT unique_user_route UNIQUE (user_id, route_id);


--
-- TOC entry 4848 (class 2606 OID 16518)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4850 (class 2606 OID 16520)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16522)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4813 (class 1259 OID 16523)
-- Name: idx_comments_route; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_route ON public.comments USING btree (route_id);


--
-- TOC entry 4814 (class 1259 OID 16524)
-- Name: idx_node_distances_a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_node_distances_a ON public.node_distances USING btree (node_a);


--
-- TOC entry 4815 (class 1259 OID 16525)
-- Name: idx_node_distances_b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_node_distances_b ON public.node_distances USING btree (node_b);


--
-- TOC entry 4824 (class 1259 OID 16526)
-- Name: idx_ratings_route; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ratings_route ON public.ratings USING btree (route_id);


--
-- TOC entry 4831 (class 1259 OID 16527)
-- Name: idx_reservations_route; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_route ON public.reservations USING btree (route_id);


--
-- TOC entry 4832 (class 1259 OID 16528)
-- Name: idx_reservations_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_user ON public.reservations USING btree (user_id);


--
-- TOC entry 4839 (class 1259 OID 16529)
-- Name: idx_route_nodes_node; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_route_nodes_node ON public.route_nodes USING btree (node_id);


--
-- TOC entry 4840 (class 1259 OID 16530)
-- Name: idx_route_nodes_route; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_route_nodes_route ON public.route_nodes USING btree (route_id);


--
-- TOC entry 4853 (class 2606 OID 16531)
-- Name: comments comments_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id);


--
-- TOC entry 4854 (class 2606 OID 16536)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4860 (class 2606 OID 16541)
-- Name: reservations fk_destination_node; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_destination_node FOREIGN KEY (destination_node_id) REFERENCES public.nodes(id);


--
-- TOC entry 4861 (class 2606 OID 16546)
-- Name: reservations fk_origin_node; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_origin_node FOREIGN KEY (origin_node_id) REFERENCES public.nodes(id);


--
-- TOC entry 4855 (class 2606 OID 16551)
-- Name: node_distances node_distances_node_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.node_distances
    ADD CONSTRAINT node_distances_node_a_fkey FOREIGN KEY (node_a) REFERENCES public.nodes(id);


--
-- TOC entry 4856 (class 2606 OID 16556)
-- Name: node_distances node_distances_node_b_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.node_distances
    ADD CONSTRAINT node_distances_node_b_fkey FOREIGN KEY (node_b) REFERENCES public.nodes(id);


--
-- TOC entry 4857 (class 2606 OID 16561)
-- Name: nodes nodes_parent_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_parent_node_id_fkey FOREIGN KEY (parent_node_id) REFERENCES public.nodes(id);


--
-- TOC entry 4858 (class 2606 OID 16566)
-- Name: ratings ratings_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id);


--
-- TOC entry 4859 (class 2606 OID 16571)
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4862 (class 2606 OID 16576)
-- Name: reservations reservations_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id);


--
-- TOC entry 4863 (class 2606 OID 16581)
-- Name: reservations reservations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4864 (class 2606 OID 16586)
-- Name: route_nodes route_nodes_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_nodes
    ADD CONSTRAINT route_nodes_node_id_fkey FOREIGN KEY (node_id) REFERENCES public.nodes(id);


--
-- TOC entry 4865 (class 2606 OID 16591)
-- Name: route_nodes route_nodes_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_nodes
    ADD CONSTRAINT route_nodes_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id);


--
-- TOC entry 4866 (class 2606 OID 16596)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- Completed on 2026-05-01 13:20:37

--
-- PostgreSQL database dump complete
--

\unrestrict X8S8dg76f1ukKVops8NTAelH5BAIfWFUkYIqJjF1VWlZyhmrgdxH40VvmjjcEGa

