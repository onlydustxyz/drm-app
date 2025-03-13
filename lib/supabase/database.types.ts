export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			repositories: {
				Row: {
					created_at: string;
					description: string | null;
					forks: number | null;
					id: string;
					languages: Json[] | null;
					last_updated_at: string | null;
					name: string | null;
					stars: number | null;
					url: string | null;
					watchers: number | null;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					forks?: number | null;
					id?: string;
					languages?: Json[] | null;
					last_updated_at?: string | null;
					name?: string | null;
					stars?: number | null;
					url?: string | null;
					watchers?: number | null;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					forks?: number | null;
					id?: string;
					languages?: Json[] | null;
					last_updated_at?: string | null;
					name?: string | null;
					stars?: number | null;
					url?: string | null;
					watchers?: number | null;
				};
				Relationships: [];
			};
			contributor_sublists: {
				Row: {
					id: string;
					name: string;
					description: string;
					contributor_ids: string[];
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description: string;
					contributor_ids: string[];
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					description?: string;
					contributor_ids?: string[];
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			contributor_retention: {
				Row: {
					id: number;
					month: string;
					active_count: number;
					total_count: number;
					retention_rate: number;
					contributor_ids: string[];
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					month: string;
					active_count: number;
					total_count: number;
					retention_rate: number;
					contributor_ids: string[];
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					month?: string;
					active_count?: number;
					total_count?: number;
					retention_rate?: number;
					contributor_ids?: string[];
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			dashboard_kpis: {
				Row: {
					id: number;
					full_time_devs: number;
					full_time_devs_growth: number;
					monthly_active_devs: number;
					monthly_active_devs_growth: number;
					total_repos: number;
					total_repos_growth: number;
					total_commits: number;
					total_commits_growth: number;
					total_projects: number;
					total_projects_growth: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					full_time_devs: number;
					full_time_devs_growth: number;
					monthly_active_devs: number;
					monthly_active_devs_growth: number;
					total_repos: number;
					total_repos_growth: number;
					total_commits: number;
					total_commits_growth: number;
					total_projects: number;
					total_projects_growth: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					full_time_devs?: number;
					full_time_devs_growth?: number;
					monthly_active_devs?: number;
					monthly_active_devs_growth?: number;
					total_repos?: number;
					total_repos_growth?: number;
					total_commits?: number;
					total_commits_growth?: number;
					total_projects?: number;
					total_projects_growth?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			developer_activity: {
				Row: {
					id: number;
					name: string;
					full_time: number;
					part_time: number;
					on_time: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					name: string;
					full_time: number;
					part_time: number;
					on_time: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					name?: string;
					full_time?: number;
					part_time?: number;
					on_time?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			developer_locations: {
				Row: {
					id: number;
					country: string;
					count: number;
					latitude: number;
					longitude: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					country: string;
					count: number;
					latitude: number;
					longitude: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					country?: string;
					count?: number;
					latitude?: number;
					longitude?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			commits_by_dev_type: {
				Row: {
					id: number;
					name: string;
					full_time: number;
					part_time: number;
					on_time: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					name: string;
					full_time: number;
					part_time: number;
					on_time: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					name?: string;
					full_time?: number;
					part_time?: number;
					on_time?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			monthly_commits: {
				Row: {
					id: number;
					date: string;
					count: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					date: string;
					count: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					date?: string;
					count?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			monthly_prs_merged: {
				Row: {
					id: number;
					date: string;
					count: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					date: string;
					count: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					date?: string;
					count?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			dev_activity: {
				Row: {
					id: number;
					date: string;
					active: number;
					churned: number;
					reactivated: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					date: string;
					active: number;
					churned: number;
					reactivated: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					date?: string;
					active?: number;
					churned?: number;
					reactivated?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
	? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
	? PublicSchema["Enums"][PublicEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
	? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;
