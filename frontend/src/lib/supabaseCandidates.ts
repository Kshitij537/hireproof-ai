import { supabase } from "./supabase";

export interface SupabaseCandidateRow {
    id: string;
    name: string;
    github_url: string;
    score: number;
    authenticity_level: string;
    report_id: string;
    created_by: string;
    created_at: string;
}

/**
 * Insert a scanned candidate into Supabase.
 * Skips silently if a row with the same report_id + created_by already exists.
 * Never throws — returns { success, error } so callers can log but not crash.
 */
export async function insertScannedCandidate(params: {
    name: string;
    githubUrl: string;
    score: number;
    authenticityLevel: string;
    reportId: string;
    createdBy: string;
}): Promise<{ success: boolean; error?: string }> {
    try {
        // Check for duplicate
        const { data: existing } = await supabase
            .from("candidates")
            .select("id")
            .eq("report_id", params.reportId)
            .eq("created_by", params.createdBy)
            .limit(1);

        if (existing && existing.length > 0) {
            return { success: true }; // already exists, skip
        }

        const { error } = await supabase.from("candidates").insert({
            name: params.name,
            github_url: params.githubUrl,
            score: params.score,
            authenticity_level: params.authenticityLevel,
            report_id: params.reportId,
            created_by: params.createdBy,
        });

        if (error) {
            console.error("[Supabase] Insert failed:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("[Supabase] Insert exception:", err);
        return { success: false, error: String(err) };
    }
}

/**
 * Fetch all candidates created by the given user, newest first.
 */
export async function fetchRecruiterCandidates(
    createdBy: string
): Promise<SupabaseCandidateRow[]> {
    try {
        const { data, error } = await supabase
            .from("candidates")
            .select("*")
            .eq("created_by", createdBy)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[Supabase] Fetch failed:", error.message);
            return [];
        }

        return (data as SupabaseCandidateRow[]) ?? [];
    } catch (err) {
        console.error("[Supabase] Fetch exception:", err);
        return [];
    }
}
