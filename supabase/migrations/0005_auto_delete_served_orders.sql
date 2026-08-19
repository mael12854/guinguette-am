create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'cleanup-served-orders',
  '* * * * *',
  $$delete from public.orders where status = 'servie' and updated_at < now() - interval '5 minutes';$$
);
