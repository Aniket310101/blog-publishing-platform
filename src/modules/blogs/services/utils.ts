const facetFieldMapping = {
  title: {
    type: 'string',
    path: 'title',
  },
  status: {
    type: 'string',
    path: 'status',
  },
  authorName: {
    type: 'string',
    path: 'author.username',
  },
};

export default facetFieldMapping;
