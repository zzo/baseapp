describe("logout", function() {

    it("should use defaults", function() {
        setFixtures('<button id="logout">Logout</button>');

        var logout = $("#logout").logout();

        spyOn($, "ajax");
        logout.click();

        var args = $.ajax.mostRecentCall.args[0];
        expect(args.url).toEqual("/user/logout");
        expect(args.type).toEqual("POST");
    });

    it("should be configurable", function() {
        setFixtures('<button id="foo">Logout</button>');

        var logout = $("#foo").logout({ url: '/howdy' });

        spyOn($, "ajax");
        logout.click();

        var args = $.ajax.mostRecentCall.args[0];
        expect(args.url).toEqual("/howdy");
        expect(args.type).toEqual("POST");
    });
});

