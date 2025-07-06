import React, { Component } from 'react';
import './ContentRating.css';

class ContentRating extends Component {
  constructor() {
    super();
    this.state = {
      likes: 0,
      dislikes: 0,
      totalLikes: 0,
      totalDislikes: 0,
      animations: [], // Array to hold animation elements
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleDislike = this.handleDislike.bind(this);
    this.likeButtonRef = React.createRef(); // Ref for getting button position
    this.dislikeButtonRef = React.createRef(); // Ref for getting button position
  }

  // Function to trigger the visual animation
  triggerAnimation(type, buttonRef) {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const contentRatingRect = buttonRef.current.closest('.content-rating').getBoundingClientRect();

    // Calculate position relative to the .content-rating parent
    const xPos = (buttonRect.left - contentRatingRect.left) + (buttonRect.width / 2);
    const yPos = (buttonRect.top - contentRatingRect.top) + (buttonRect.height / 2);

    this.setState(prevState => ({
      animations: [
        ...prevState.animations,
        {
          id: Date.now(), // Unique ID for each animation instance
          type: type,
          x: xPos,
          y: yPos,
        },
      ],
    }));
  }

  // Function to remove an animation element from state after it completes
  removeAnimation(id) {
    this.setState(prevState => ({
      animations: prevState.animations.filter(anim => anim.id !== id),
    }));
  }

  handleLike() {
    this.setState((prevState) => ({
      likes: prevState.likes + 1,
      totalLikes: prevState.totalLikes + 1,
    }), () => {
      // Callback after state is updated to trigger animation
      this.triggerAnimation('like', this.likeButtonRef);
    });
  }

  handleDislike() {
    this.setState((prevState) => ({
      dislikes: prevState.dislikes + 1,
      totalDislikes: prevState.totalDislikes + 1,
    }), () => {
      // Callback after state is updated to trigger animation
      this.triggerAnimation('dislike', this.dislikeButtonRef);
    });
  }

  render() {
    const { totalLikes, totalDislikes } = this.state;
    let overallRatingDisplay;

    // Calculate ratio: total likes / total dislikes
    if (totalLikes === 0 && totalDislikes === 0) {
      overallRatingDisplay = 'No Ratings Yet';
    } else if (totalDislikes === 0) {
      // If no dislikes, it's perfectly positive (or just likes)
      overallRatingDisplay = `Positive (${totalLikes} / 0)`;
    } else {
      const ratio = (totalLikes / totalDislikes).toFixed(2); // Calculate and format to 2 decimal places
      overallRatingDisplay = `Ratio: ${ratio} (${totalLikes} / ${totalDislikes})`;
    }

    return (
      <>
        <h1>Text Content Rating</h1>
        <div className='content-rating'>
          <p className="content-text">
            What do you think of this UI made using React? let us know your opinion by giving a like or dislike!
          </p>

          <div className='button-and-counts'>
            <div className='rating-buttons'>
              <button
                className="like-button"
                onClick={this.handleLike}
                ref={this.likeButtonRef} // Attach ref to the button
              >
                Like ({this.state.likes})
              </button>
              <button
                className="dislike-button"
                onClick={this.handleDislike}
                ref={this.dislikeButtonRef} // Attach ref to the button
              >
                Dislike ({this.state.dislikes})
              </button>
            </div>

            <div className="total-counts">
              <span className="total-likes-display">Total Likes: {totalLikes}</span>
              <span className="total-dislikes-display">Total Dislikes: {totalDislikes}</span>
            </div>
          </div>

          <p className="overall-rating-display">Overall Rating: {overallRatingDisplay}</p>

          {/* Render dynamic animation elements */}
          {this.state.animations.map(anim => (
            <div
              key={anim.id}
              className={`click-animation ${anim.type}-animation`}
              // Position the animation relative to the .content-rating div
              style={{ left: anim.x, top: anim.y }}
              onAnimationEnd={() => this.removeAnimation(anim.id)}
            ></div>
          ))}
        </div>
      </>
    );
  }
}

export default ContentRating;