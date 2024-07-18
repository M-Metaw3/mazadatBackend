const AppShareLinkService = require('./appShareLinkService');
const catchAsync = require('../../utils/catchAsync');

exports.createAppShareLink = catchAsync(async (req, res) => {
  console.log(req.body)
  const appShareLink = await AppShareLinkService.createAppShareLink(req.body);
  res.status(201).json({ status: 'success', data: appShareLink });
});

exports.getAllAppShareLinks = catchAsync(async (req, res) => {
  const appShareLinks = await AppShareLinkService.getAllAppShareLinks();
  const language = req.language;

  const formattedLinks = appShareLinks.map(doc => {
    if (doc[language]) {
      return {
        appShareLink: doc[language]
      };
    }
    return doc;
  });

  res.status(200).json({ status: 'success', data: formattedLinks });
});


exports.getAppShareLinkById = catchAsync(async (req, res) => {
  const appShareLink = await AppShareLinkService.getAppShareLinkById(req.params.id);
  if (!appShareLink) {
    return res.status(404).json({ status: 'error', message: 'App Share Link not found' });
  }

  const language = req.language;
  const formattedLink = { appShareLink: appShareLink[language] };

  res.status(200).json({ status: 'success', data: formattedLink });
});

exports.updateAppShareLink = catchAsync(async (req, res) => {
  const appShareLink = await AppShareLinkService.updateAppShareLink(req.params.id, req.body);
  if (!appShareLink) {
    return res.status(404).json({ status: 'error', message: 'App Share Link not found' });
  }
  res.status(200).json({ status: 'success', data: appShareLink });
});

exports.deleteAppShareLink = catchAsync(async (req, res) => {
  const appShareLink = await AppShareLinkService.deleteAppShareLink(req.params.id);
  if (!appShareLink) {
    return res.status(404).json({ status: 'error', message: 'App Share Link not found' });
  }
  res.status(204).json({ status: 'success', data: null });
});
