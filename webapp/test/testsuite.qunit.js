sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: bookshop",
		defaults: {
			page: "ui5://test-resources/bookshop/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "bookshop/",
				never: "test-resources/bookshop/"
			},
			loader: {
				paths: {
					"bookshop": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for bookshop"
			},
			"integration/opaTests": {
				title: "Integration tests for bookshop"
			}
		}
	};
});
