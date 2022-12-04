describe('Clip:Testing Video player', () => {
	it('Shoul play clip', () => {
		cy.visit('/');
		cy.get('app-clips-list > .grid a:first').click(); // select by css
		cy.get('.video-js').click(); // run video
		cy.wait(3000); // wait couple seconds
		cy.get('.video-js').click(); // stop video
		// check progressbar of video
		cy.get('.vjs-play-progress').invoke('width').should('gte', 0); // greather then or equel
	});
});