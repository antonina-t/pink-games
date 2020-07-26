const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;
    return (minutes > 0 ? minutes + "m " : "") + seconds + "s";
}

export default formatTime;