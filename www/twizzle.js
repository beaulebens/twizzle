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
      'http://vip-workshop.dev/rest-api/fishing/wp-json/posts?filter[posts_per_page]=20',
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
      '<p class="failed">Could not load posts from WordPress.</p>'
    );
  },

  /**
   * Handle the main code-path of taking in a collection of posts and then
   * getting them rendered into cards etc on-screen. Append the board to
   * #twizzle, wrapped in a <div/>.
   */
  renderBoard: function( data ) {
    console.log( data );
  },

  /**
   * Given a collection of posts, figure out a list of unique tags applied
   * to them, and return that as an array.
   */
  getUniqueTags: function() {

  },

  /**
   * Top-level handler for rendering a tag-specific card (and the posts which
   * have that tag applied to them). Should accept a tag name, and a collection
   * of posts which will be rendered into that card. Use the template in
   * #tpl-card to render.
   */
  renderCard: function() {

  },

  /**
   * Render an entry for a specific post. Should accept a post object and
   * use the template in #tpl-post to render the post into a card (see above).
   */
  renderPost: function() {

  }
};
