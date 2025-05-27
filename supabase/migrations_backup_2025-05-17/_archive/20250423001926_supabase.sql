alter table "public"."assinantes" drop constraint "assinantes_status_check";

alter table "public"."parceiros" drop constraint "parceiros_plano_check";

alter table "public"."payouts" drop constraint "payouts_status_check";

alter table "public"."periodos" drop constraint "periodos_periodicidade_check";

alter table "public"."assinantes" add constraint "assinantes_status_check" CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'PAUSED'::character varying, 'CANCELED'::character varying, 'PAST_DUE'::character varying])::text[]))) not valid;

alter table "public"."assinantes" validate constraint "assinantes_status_check";

alter table "public"."parceiros" add constraint "parceiros_plano_check" CHECK (((plano)::text = ANY ((ARRAY['FREE'::character varying, 'PREMIUM'::character varying])::text[]))) not valid;

alter table "public"."parceiros" validate constraint "parceiros_plano_check";

alter table "public"."payouts" add constraint "payouts_status_check" CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'SKIPPED'::character varying])::text[]))) not valid;

alter table "public"."payouts" validate constraint "payouts_status_check";

alter table "public"."periodos" add constraint "periodos_periodicidade_check" CHECK (((periodicidade)::text = ANY ((ARRAY['WEEK'::character varying, 'MONTH'::character varying, 'YEAR'::character varying])::text[]))) not valid;

alter table "public"."periodos" validate constraint "periodos_periodicidade_check";


