KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('delayactivator', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/delayactivator/2.0.0/']});