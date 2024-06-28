CREATE TABLE IF NOT EXISTS users_preferences (
    uid TEXT PRIMARY KEY,
    show_scores BOOLEAN NOT NULL DEFAULT FALSE,
    favorite_teams TEXT[] NOT NULL DEFAULT '{}',
    favorite_competitions TEXT[] NOT NULL DEFAULT '{}',
    timezone text NOT NULL DEFAULT 'America/Chicago',
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    version integer NOT NULL DEFAULT 1
);

-- Only allow 5 id's per favorite_teams and favorite_competitions
ALTER TABLE users_preferences
ADD CONSTRAINT check_arrays_length
CHECK (array_length(favorite_teams, 1) <= 5 AND array_length(favorite_competitions, 1) <= 5);

CREATE OR REPLACE FUNCTION check_arrays_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF array_length(NEW.favorite_teams, 1) > 5 THEN
        RAISE EXCEPTION 'favorite_teams array cannot have more than 5 items';
    END IF;
    IF array_length(NEW.favorite_competitions, 1) > 5 THEN
        RAISE EXCEPTION 'favorite_competitions array cannot have more than 5 items';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_arrays_limit
BEFORE INSERT OR UPDATE ON users_preferences
FOR EACH ROW
EXECUTE FUNCTION check_arrays_trigger();

-- Ensure that for each row, check favorite_teams & favorite_competitions have unique values independently
CREATE OR REPLACE FUNCTION ensure_unique_array_elements()
RETURNS TRIGGER AS $$
BEGIN
    NEW.favorite_teams := (SELECT array_agg(DISTINCT unnest(NEW.favorite_teams)));
    NEW.favorite_competitions := (SELECT array_agg(DISTINCT unnest(NEW.favorite_competitions)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_unique_array_elements
BEFORE INSERT OR UPDATE ON users_preferences
FOR EACH ROW
EXECUTE FUNCTION ensure_unique_array_elements();
