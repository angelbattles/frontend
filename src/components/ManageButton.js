import React from 'react';

class ManageButton extends React.Component {


handleClick = (props) => e => {
    e.preventDefault();
    props.manageTokenSelect(this.props.id)
    }

    render(props) {
        return (
            <button className={`ui purple button`} onClick={this.props.manageTokenSelect(this.props.id)}>Manage {this.props.id}</button>
        );
    }


}
export default ManageButton;



