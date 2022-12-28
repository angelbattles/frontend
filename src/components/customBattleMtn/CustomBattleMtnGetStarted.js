const CustomBattleMtnGetStarted = ({ startNewMountain }) => {
  return (
    <div className="ui raised segment">
      <p>
        Create your own custom public or private mountain. You choose what cards
        can be played on your mountain.
      </p>

      <button className="ui positive button" onClick={() => startNewMountain()}>
        Get Started
      </button>
    </div>
  );
};

export default CustomBattleMtnGetStarted;
