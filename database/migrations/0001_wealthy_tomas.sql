CREATE TABLE "navigation_events" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"source_route" text NOT NULL,
	"destination_route" text NOT NULL,
	"event_type" text NOT NULL,
	"navigation_success" boolean NOT NULL,
	"device_type" text NOT NULL,
	"viewport_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
