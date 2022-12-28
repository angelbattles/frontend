import React from 'react';

function LoadingButton({
  color = 'positive',
  loadingColor = 'positive',
  isLoading = false,
  onClick = () => {},
  children,
}) {
  if (isLoading) {
    return (
      <button className={`ui ${loadingColor} loading button`}>Loading</button>
    );
  }

  return (
    <button className={`ui ${color} button`} onClick={onClick}>
      {children}
    </button>
  );
}
export default LoadingButton;
