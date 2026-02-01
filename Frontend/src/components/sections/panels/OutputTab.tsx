

const OutputTab = ({output}:any) => {
  return (
    <div className="h-full bg-base-100 flex flex-col fade-right bg-background backdrop-blur-lg">
      <div className="px-4 py-2 bg-base-100 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <pre className="text-sm font-mono text-success whitespace-pre-wrap">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-destructive whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputTab
