export const MemoList = ({ memos = [] }) => (
  <>
    <h1>Memos received ({memos.length})</h1>
    <div className="overflow-y-scroll w-96 h-52">
      {memos.map((memo, idx) => {
        return (
          <div
            key={idx}
            className="rounded-lg border-orange-400 border-2 p-2 mb-1"
          >
            <p style={{ fontWeight: "bold" }}>"{memo.message}"</p>
            <p>
              From: {memo.name} at{" "}
              {new Date(memo.timestamp * 1000).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  </>
);
