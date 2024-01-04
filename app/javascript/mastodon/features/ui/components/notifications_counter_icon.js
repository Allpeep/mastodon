import { connect } from 'react-redux';

import { IconWithBadge } from 'mastodon/components/icon_with_badge';

const mapStateToProps = state => {
  const count = state.getIn(['notifications', 'unread']);
  if (navigator.setAppBadge) {
    navigator.setAppBadge(count);
  }

  return {
  count,
  id: 'bell',
}};

export default connect(mapStateToProps)(IconWithBadge);
