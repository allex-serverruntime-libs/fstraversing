var Node;
function basicReporter () {
  console.log(arguments);
}

describe('Test Basic', function () {
  it('Load library', function () {
    setGlobal('TreeTraverser', require('../index')(lib));
  });
  it('Create Traverser', function () {
    Node = require('allex_nodehelpersserverruntimelib')(lib);
    setGlobal('Traverser', new TreeTraverser(Node.Path.join(__dirname, 'test.dir'), 3, basicReporter));
  });
  it('Run Traverser', function () {
    return Traverser.go();
  });
  it('Destroy Traverser', function () {
    Traverser.destroy();
  });
  it('Create a dirsonly Traverser', function () {
    setGlobal('Traverser', new TreeTraverser(Node.Path.join(__dirname, 'test.dir'), 3, basicReporter, 'd'));
  });
  it('Run the dirsonly Traverser', function () {
    return Traverser.go();
  });
});
