import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRepositoryRetentionData } from "@/lib/services/repository-sublists-service";
import { RepositoryActivityHeatmap } from "@/components/charts/repository-activity-heatmap";

const RetentionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [retentionData, setRetentionData] = useState([]);

  useEffect(() => {
    if (id) {
      getRepositoryRetentionData(id).then((data) => setRetentionData(data));
    }
  }, [id]);

  return (
    <div>
      <h1>Repository Retention</h1>
      <RepositoryActivityHeatmap data={retentionData} />
    </div>
  );
};

export default RetentionPage;
