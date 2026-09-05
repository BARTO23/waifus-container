## Purpose

Provides a structured catalog and API service delivering at least 400 curated red-haired waifus spanning Japanese manga, Korean manhwa, and Chinese manhua to support rich client-side browsing and filtering.

## ADDED Requirements

### Requirement: Catalog contains at least 400 red-haired waifus across diverse mediums
The system SHALL provide a dataset containing a minimum of 400 distinct red-haired female characters sourced from Japanese manga, Korean manhwa, and Chinese manhua.

#### Scenario: Verify minimum character count and diversity
- **WHEN** client requests the complete catalog statistics or all characters
- **THEN** the total character count SHALL be greater than or equal to 400, and each origin medium (manga, manhwa, manhua) SHALL be represented.

### Requirement: Standardized character metadata schema
The system SHALL expose standardized metadata for each character in the catalog, including unique identifier, name, origin medium, source series name, description, tags, and a valid image URL.

#### Scenario: Verify character record structure
- **WHEN** a client retrieves character records from the API
- **THEN** each character record SHALL contain `id`, `name`, `origin` (one of `manga`, `manhwa`, `manhua`), `series`, `description`, `tags` (array of strings), and `image` (valid URL string).

### Requirement: Paginated catalog querying
The system SHALL support pagination parameters (`page` and `limit`, or equivalent offset mechanism) when querying the catalog to ensure performant loading on the client.

#### Scenario: Querying first page with limit
- **WHEN** client issues a GET request with `page=1` and `limit=20`
- **THEN** the system SHALL return at most 20 character records along with pagination metadata (`total`, `page`, `limit`, `totalPages`, `hasNextPage`).

#### Scenario: Querying subsequent pages
- **WHEN** client requests `page=2` with `limit=20`
- **THEN** the system SHALL return the subsequent distinct set of character records without duplicating items from previous pages.

### Requirement: Filtering by origin medium
The system SHALL allow clients to filter characters by their origin medium (`manga`, `manhwa`, or `manhua`).

#### Scenario: Filter characters by manhwa origin
- **WHEN** client requests characters with parameter `origin=manhwa`
- **THEN** all returned character records SHALL have `origin` set to `manhwa`.

### Requirement: Search by character name or series
The system SHALL support searching characters via case-insensitive query strings matching character names or series titles.

#### Scenario: Search matching character name
- **WHEN** client queries with search term `Rias`
- **THEN** returned results SHALL include records whose `name` or `series` contains `Rias` regardless of letter casing.
