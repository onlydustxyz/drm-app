create schema if not exists indexer;
create type indexer.job_status as enum ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED');


create table if not exists indexer.repo_public_events_indexing_jobs
(
    repo_owner           text                                                           not null,
    repo_name            text                                                           not null,
    repo_id              bigint,
    status               indexer.job_status       default 'PENDING'::indexer.job_status not null,
    started_at           timestamp with time zone,
    finished_at          timestamp with time zone,
    last_event_timestamp timestamp with time zone,
    tech_created_at      timestamp with time zone default now()                         not null,
    tech_updated_at      timestamp with time zone default now()                         not null,
    primary key (repo_owner, repo_name)
);


