-- name: CreateUser :one
INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    phone,
    street,
    city,
    state,
    country,
    username,
    password_hash,
    terms_accepted,
    newsletter
) VALUES (
    $1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10,
    $11, $12, $13
)
RETURNING id, created_at, updated_at;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 LIMIT 1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1 LIMIT 1;

-- name: CheckEmailExists :one
SELECT EXISTS(
    SELECT 1 FROM users WHERE email = $1
);

-- name: CheckUsernameExists :one
SELECT EXISTS(
    SELECT 1 FROM users WHERE username = $1
);

-- name: HealthCheck :one
SELECT 1;


