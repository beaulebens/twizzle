var twizzle = {
  /**
   * Drop a message in the console, then start twizzle up
   */
  start: function() {
    console.log( 'twizzling' );
    this.renderApp();
  },

  /**
   * Empties the destination container, renders a header, then requests the
   * posts which will end up getting rendered into the app.
   */
  renderApp: function() {
    $( '#twizzle' ).empty();
    this.renderHeader();
    this.fetchPosts();
  },

  /**
   * Renders a very simple header into the page. Shows you how to do
   * basic variable substitution using lodash templates.
   */
  renderHeader: function() {
    $( '#twizzle' ).append(
      _.template( $( '#tpl-header' ).text() )( { appName: 'twizzle!' } )
    );
  },

  /**
   * Make a request to get the most recent 20 posts from the REST API on
   * the local WordPress install. Once you have the data, pass it to
   * renderBoard() to start rendering everything.
   */
  fetchPosts: function() {
    $.getJSON(
      'http://vip-workshop.dev/rest-api/fishing/wp-json/wp/v2/posts?posts_per_page=10',
      function( data ) {
        this.renderBoard( data );
      }.bind( this )
    ).fail( function() {
      this.handleRequestFailure();
    }.bind( this ) );
  },

  /**
   * Extremely basic error message if something goes wrong.
   */
  handleRequestFailure: function() {
    $( '#twizzle' ).append(
      // You shouldn't mix DOM in here like this!
      '<p class="failed">Could not load posts from WordPress.</p>'
    );
  },

  /**
   * Handle the main code-path of taking in a collection of posts and then
   * getting them rendered into cards etc on-screen. Append the board to
   * #twizzle, wrapped in a <div/>.
   */
  renderBoard: function( data ) {
    // Get a list of unique tags used across all posts
    var tags = this.getUniqueTags( data );

    // Slice things so that we have posts listed per tag
    tags.map( function( tag ) {
      var posts = _.filter( data, function( post ) {
        return _.any( post.terms.post_tag, function( postTag ) {
          return postTag.slug === tag;
        } );
      } );

      // Render a card for each tag
      this.renderCard( tag, posts );
    }.bind( this ) );
  },

  /**
   * Given a collection of posts, figure out a list of unique tags applied
   * to them, and return that as an array.
   */
  getUniqueTags: function( data ) {
    var raw = _.pluck( data, 'terms.post_tag' );
    var list = [];
    raw.map( function( tags ) {
      _.each( tags, function( tag ) {
        list.push( tag.slug );
      } );
    } );
    list = _.shuffle( _.unique( list ) );

    return list;
  },

  /**
   * Top-level handler for rendering a tag-specific card (and the posts which
   * have that tag applied to them). Should accept a tag name, and a collection
   * of posts which will be rendered into that card. Use the template in
   * #tpl-card to render.
   */
  renderCard: function( tag, posts ) {
    if ( _.isEmpty( posts ) ) {
      return;
    }

    var postsHTML,
        postsArr = [];

    // Render each post into an array element
    posts.map( function( post ) {
      postsArr.push( this.renderPost( post ) );
    }.bind( this ) );

    // At this point, if we haven't rendered any posts, then don't render the card
    postsHTML = postsArr.join( '' );
    if ( ! postsHTML.length ) {
      return;
    }

    // Render the card for this tag, with all posts rendered inside it
    $( '#twizzle' ).append(
      _.template( $( '#tpl-card' ).text() )( {
        tag: tag,
        posts: postsHTML
      } )
    );
  },

  /**
   * Render an entry for a specific post. Should accept a post object and
   * use the template in #tpl-post to render the post into a card (see above).
   */
  renderPost: function( post ) {
    var image = ( // big ugly path-check to make sure we have a featured image
      post &&
      post.featured_image &&
      post.featured_image.attachment_meta &&
      post.featured_image.attachment_meta.sizes &&
      post.featured_image.attachment_meta.sizes.large
    ) ? post.featured_image.attachment_meta.sizes.large.url : '';

    return image ? _.template( $( '#tpl-post' ).text() )( {
      image: image,
      title: post.title,
      permalink: post.link
    } ) : null;
  }
};
