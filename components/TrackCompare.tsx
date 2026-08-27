import type { Track } from "@/lib/curriculum";

export function TrackCompare({ tracks }: { tracks: Track[] }) {
  const conceptIds = Array.from(
    new Set(tracks.flatMap((track) => track.concepts.map((concept) => concept.conceptId))),
  );

  return (
    <div className="compare">
      <table>
        <thead>
          <tr>
            <th>แนวคิด</th>
            {tracks.map((track) => (
              <th key={track.id}>{track.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conceptIds.map((conceptId) => (
            <tr key={conceptId}>
              <td>
                <code>{conceptId}</code>
              </td>
              {tracks.map((track) => {
                const concept = track.concepts.find((item) => item.conceptId === conceptId);
                return (
                  <td key={track.id}>
                    {concept ? (
                      <>
                        <strong>{concept.uiLabel}</strong>
                        <br />
                        {concept.labDelta}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
