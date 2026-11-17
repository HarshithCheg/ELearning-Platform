import './Components.css';

export default function ProgressBar({completed, total}) {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="progress-summary">
            <div
                className="progress-container"
                role="progressbar"
                aria-label="Course progress"
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <div className="progress-fill" style={{width: `${percentage}%`}} />
            </div>
            <p className="progress-text">{percentage}% completed ({completed}/{total} lessons)</p>
        </div>
    );
}