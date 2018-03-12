{
  let a,b,rest;
  [a,b]=[1,2];
  console.log(a,b);
}

{
  let a,b,rest;
  [a,b,...rest]=[1,2,4,5,6,7];
  console.log(a,b,rest);
}

{
  let a,b;
  ({a,b}={a:1,b:2})
  console.log(a,b)
}

{
  let o ={p:42,q:true};
  let {p,q}=o;
  console.log(p,q)
}

{
  let metaData = {
    title:'abc',
    info:[{
      title:'info-title',
      desc:'description'
    }]
  }

  let {title:esTitle,info:[{title:cnTitle}]}=metaData;
  console.log(esTitle,cnTitle)
}