interface StatusBarProps {
    type: 'interal' | 'external' | 'netflow';
    value: number;
}

export default function StatusBar({type, value}:StatusBarProps){
    return(
        <>
        <div className="h-[4px] color-">
        </div>
        </>
    );
}