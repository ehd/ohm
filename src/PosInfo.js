'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo(state) {
  this.state = state;
  this.applicationStack = [];  // a stack of "memo keys" of the active applications
  this.memo = {};
  this.currentLeftRecursion = undefined;
}

PosInfo.prototype = {
  isActive: function(application) {
    return this.applicationStack.indexOf(application.toMemoKey()) !== -1;
  },

  enter: function(application) {
    this.state.enter(application);
    this.applicationStack.push(application.toMemoKey());
  },

  exit: function() {
    this.state.exit();
    this.applicationStack.pop();
  },

  startLeftRecursion: function(headApplication, memoRec) {
    var applicationStack = this.applicationStack;
    memoRec.nextLeftRecursion = this.currentLeftRecursion;
    memoRec.headApplication = headApplication;
    var indexOfFirstInvolvedRule = applicationStack.indexOf(headApplication.toMemoKey()) + 1;
    var involvedApplications = applicationStack.slice(indexOfFirstInvolvedRule);
    memoRec.isInvolved = function(application) {
      return involvedApplications.indexOf(application.toMemoKey()) >= 0;
    };
    memoRec.updateInvolvedApplications = function() {
      for (var idx = indexOfFirstInvolvedRule + 1; idx < applicationStack.length; idx++) {
        var application = applicationStack[idx];
        if (!this.isInvolved(application)) {
          involvedApplications.push(application);
        }
      }
    };
    this.currentLeftRecursion = memoRec;
  },

  endLeftRecursion: function(application) {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;
