import './Components.css';

export default function ProgressBar({completed, total}) {
    function calcPercentage(){
        if(total == 0){
            return 0;
        }
        else{
            return Math.round((completed/total) * 100);
        }
    }

    return (
        <>
            <div className='prog-bar'>
                <div className="prog-fill" style={{width: `${calcPercentage()}%`}}>
                </div>
            </div>
            <p>{calcPercentage()}% Completed ({completed}/{total} lessons) </p>
        </>
    );
}