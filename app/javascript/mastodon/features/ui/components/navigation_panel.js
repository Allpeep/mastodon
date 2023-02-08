import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Logo from 'mastodon/components/logo';
import { timelinePreview, showTrends } from 'mastodon/initial_state';
import ColumnLink from './column_link';
import DisabledAccountBanner from './disabled_account_banner';
import FollowRequestsColumnLink from './follow_requests_column_link';
import ListPanel from './list_panel';
import NotificationsCounterIcon from './notifications_counter_icon';
import SignInBanner from './sign_in_banner';
import NavigationPortal from 'mastodon/components/navigation_portal';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  hide_nav_item: state.getIn(['meta', 'hide_nav_item']),
});

const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  explore: { id: 'explore.title', defaultMessage: 'Explore' },
  local: { id: 'tabs_bar.local_timeline', defaultMessage: 'Local' },
  federated: { id: 'tabs_bar.federated_timeline', defaultMessage: 'Federated' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Direct messages' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favourites' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  followsAndFollowers: { id: 'navigation_bar.follows_and_followers', defaultMessage: 'Follows and followers' },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
});

@connect(mapStateToProps)
@injectIntl
export default class NavigationPanel extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    hide_nav_item: ImmutablePropTypes.map,
  };

  render () {
    const { intl, hide_nav_item } = this.props;
    const { signedIn, disabledAccountId } = this.context.identity;

    return (
      <div className='navigation-panel'>
        <div className='navigation-panel__logo'>
          <Link to='/' className='column-link column-link--logo'><Logo /></Link>
          <hr />
        </div>

        {signedIn && (
          <React.Fragment>
          {hide_nav_item.get('home') !== true &&
            <ColumnLink transparent to='/home' icon='home' text={intl.formatMessage(messages.home)} />
          }
          {hide_nav_item.get('notifications') !== true &&
            <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='column-link__icon' />} text={intl.formatMessage(messages.notifications)} />
          }
            <FollowRequestsColumnLink />
          </React.Fragment>
        )}

        {showTrends ?
            hide_nav_item.get('explore') !== true &&
          <ColumnLink transparent to='/explore' icon='hashtag' text={intl.formatMessage(messages.explore)} />
         : hide_nav_item.get('search') !== true &&
          <ColumnLink transparent to='/search' icon='search' text={intl.formatMessage(messages.search)} />
        }

        {(signedIn || timelinePreview) && (
          <>
          {hide_nav_item.get('local') !== true &&
            <ColumnLink transparent to='/public/local' icon='users' text={intl.formatMessage(messages.local)} />
          }
          {hide_nav_item.get('federated') !== true &&
            <ColumnLink transparent exact to='/public' icon='globe' text={intl.formatMessage(messages.federated)} />
          }
          </>
        )}

        {!signedIn && (
          <div className='navigation-panel__sign-in-banner'>
            <hr />
            { disabledAccountId ? <DisabledAccountBanner /> : <SignInBanner /> }
          </div>
        )}

        {signedIn && (
          <React.Fragment>
          {hide_nav_item.get('direct') !== true &&
            <ColumnLink transparent to='/conversations' icon='at' text={intl.formatMessage(messages.direct)} />
          }
          {hide_nav_item.get('favourites') !== true &&
            <ColumnLink transparent to='/favourites' icon='star' text={intl.formatMessage(messages.favourites)} />
          }
          {hide_nav_item.get('bookmarks') !== true &&
            <ColumnLink transparent to='/bookmarks' icon='bookmark' text={intl.formatMessage(messages.bookmarks)} />
          }
          {hide_nav_item.get('lists') !== true &&
            <ColumnLink transparent to='/lists' icon='list-ul' text={intl.formatMessage(messages.lists)} />
          }

          {hide_nav_item.get('lists') !== true &&
            <ListPanel />
          }

            <hr />

          {hide_nav_item.get('preferences') !== true &&
            <ColumnLink transparent href='/settings/preferences' icon='cog' text={intl.formatMessage(messages.preferences)} />
          }
          </React.Fragment>
        )}

        <div className='navigation-panel__legal'>
          <hr />
      {hide_nav_item.get('about') !== true &&
          <ColumnLink transparent to='/about' icon='ellipsis-h' text={intl.formatMessage(messages.about)} />
      }
        </div>

        <NavigationPortal />
      </div>
    );
  }

}
