create schema if not exists indexer_exp;

create type indexer_exp.github_account_type as enum ('USER', 'ORGANIZATION', 'BOT');

create type indexer_exp.github_pull_request_status as enum ('OPEN', 'CLOSED', 'MERGED', 'DRAFT');

create type indexer_exp.github_repo_visibility as enum ('PUBLIC', 'PRIVATE');

create type indexer_exp.github_pull_request_review_state as enum ('PENDING_REVIEWER', 'UNDER_REVIEW', 'APPROVED', 'CHANGES_REQUESTED');

create table indexer_exp.github_accounts
(
    id              bigint                          not null
        primary key,
    login           text                            not null,
    type            indexer_exp.github_account_type not null,
    html_url        text                            not null,
    avatar_url      text,
    name            text,
    tech_created_at timestamp default now()         not null,
    tech_updated_at timestamp default now()         not null,
    bio             text,
    location        text,
    website         text,
    twitter         text,
    linkedin        text,
    telegram        text,
    created_at      timestamp,
    follower_count  integer   default 0             not null
);

create unique index github_accounts_login_uidx
    on indexer_exp.github_accounts (login);

create table indexer_exp.github_repos
(
    id              bigint                             not null
        primary key,
    owner_id        bigint                             not null
        references indexer_exp.github_accounts,
    name            text                               not null,
    html_url        text                               not null,
    updated_at      timestamp,
    description     text,
    stars_count     bigint,
    forks_count     bigint,
    has_issues      boolean,
    parent_id       bigint
        references indexer_exp.github_repos,
    tech_created_at timestamp default now()            not null,
    tech_updated_at timestamp default now()            not null,
    owner_login     text                               not null,
    visibility      indexer_exp.github_repo_visibility not null,
    deleted_at      timestamp,
    readme          text,
    created_at      timestamp with time zone
);

create index github_repos_owner_login_name_idx
    on indexer_exp.github_repos (owner_login, name);

create index github_repos_id_visibility_idx
    on indexer_exp.github_repos (id, visibility);

create index github_repos_owner_id_id_idx
    on indexer_exp.github_repos (owner_id, id);

create table indexer_exp.github_pull_requests
(
    id                   bigint                                       not null
        primary key,
    repo_id              bigint                                       not null
        references indexer_exp.github_repos,
    number               bigint                                       not null,
    title                text                                         not null,
    status               indexer_exp.github_pull_request_status       not null,
    created_at           timestamp                                    not null,
    closed_at            timestamp,
    merged_at            timestamp,
    author_id            bigint                                       not null
        references indexer_exp.github_accounts,
    html_url             text                                         not null,
    body                 text,
    comments_count       integer                                      not null,
    tech_created_at      timestamp default now()                      not null,
    tech_updated_at      timestamp default now()                      not null,
    draft                boolean   default false                      not null,
    repo_owner_login     text                                         not null,
    repo_name            text                                         not null,
    repo_html_url        text                                         not null,
    author_login         text                                         not null,
    author_html_url      text                                         not null,
    author_avatar_url    text                                         not null,
    review_state         indexer_exp.github_pull_request_review_state not null,
    commit_count         integer                                      not null,
    main_file_extensions text[],
    updated_at           timestamp with time zone                     not null,
    contribution_uuid    uuid                                         not null,
    merged_by_id         bigint
        references indexer_exp.github_accounts,
    locked               boolean   default false                      not null
);

create table indexer_exp.github_commits
(
    sha             text                                   not null
        primary key,
    author_id       bigint,
    tech_created_at timestamp with time zone default now() not null,
    tech_updated_at timestamp with time zone default now() not null,
    repo_id         bigint,
    created_at      timestamp with time zone               not null
);

create index github_commits_repo_id_idx
    on indexer_exp.github_commits (repo_id);

create index github_commits_created_at_idx
    on indexer_exp.github_commits (created_at);
