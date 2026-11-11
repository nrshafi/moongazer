CREATE TABLE feedback (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, app_slug TEXT NOT NULL, page_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('source_or_text_correction','bug_report','feature_request')),
  message TEXT NOT NULL, contact TEXT, status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','verified','rejected','spam')),
  no_js INTEGER NOT NULL DEFAULT 0, reviewed_at TEXT, review_note TEXT);
CREATE INDEX feedback_status ON feedback(status, created_at);
CREATE TABLE event_counts (
  date TEXT NOT NULL, app_slug TEXT NOT NULL, item_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('activity_started','activity_completed','share_clicked')),
  count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (date, app_slug, item_id, event_type));
