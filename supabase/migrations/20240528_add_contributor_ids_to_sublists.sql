-- Add contributor_ids column to contributor_sublists table
ALTER TABLE contributor_sublists ADD COLUMN contributor_ids JSONB NOT NULL DEFAULT '[]';

-- Migrate data from the join table to the new column
DO $$
DECLARE
    sublist RECORD;
    contributor_ids_var JSONB;
BEGIN
    FOR sublist IN SELECT id FROM contributor_sublists
    LOOP
        -- Get all contributor IDs for this sublist and create a JSONB array
        SELECT json_agg(contributor_id::text)::jsonb INTO contributor_ids_var
        FROM contributor_sublists_contributors
        WHERE sublist_id = sublist.id;
        
        -- If no contributor IDs were found, use an empty array
        IF contributor_ids_var IS NULL THEN
            contributor_ids_var := '[]'::jsonb;
        END IF;
        
        -- Update the sublist with the contributor IDs
        UPDATE contributor_sublists
        SET contributor_ids = contributor_ids_var
        WHERE id = sublist.id;
    END LOOP;
END $$;

-- Create index for the new column
CREATE INDEX idx_contributor_sublists_contributor_ids ON contributor_sublists USING GIN (contributor_ids); 

-- Insert additional mock data for contributor sublists with contributor_ids
INSERT INTO contributor_sublists (name, description, contributor_ids, created_at, updated_at) 
VALUES 
    ('Frontend Specialists', 'Contributors focused on frontend development', '["15", "22", "33", "47", "51"]', now(), now()),
    ('Backend Engineers', 'Contributors focused on backend systems', '["12", "24", "37", "42", "48", "53"]', now(), now()),
    ('DevOps Team', 'Contributors managing infrastructure and deployment', '["18", "26", "39", "45"]', now(), now()),
    ('UI/UX Designers', 'Contributors focused on user experience', '["17", "29", "36", "44", "52"]', now(), now()),
    ('Security Team', 'Contributors focused on security aspects', '["14", "21", "38", "49"]', now(), now()),
    ('Mobile Developers', 'Contributors focused on mobile applications', '["19", "27", "35", "43", "50"]', now(), now()),
    ('QA Engineers', 'Contributors focused on quality assurance', '["13", "25", "34", "41", "46"]', now(), now()),
    ('Community Maintainers', 'Contributors managing community interactions', '["16", "23", "31", "40"]', now(), now()),
    ('Machine Learning Experts', 'Contributors working on ML features', '["20", "28", "32", "54"]', now(), now()),
    ('Accessibility Advocates', 'Contributors focused on accessibility improvements', '["30", "55", "56", "57"]', now(), now()); 