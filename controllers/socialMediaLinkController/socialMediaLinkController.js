const SocialMediaLinkService = require('./socialMediaLinkService');
const catchAsync = require('../../utils/catchAsync');

exports.createSocialMediaLink = catchAsync(async (req, res) => {
  const socialMediaLink = await SocialMediaLinkService.createSocialMediaLink(req.body);
  res.status(201).json({ status: 'success', data: socialMediaLink });
});

// exports.getAllSocialMediaLinks = catchAsync(async (req, res) => {
//   const socialMediaLinks = await SocialMediaLinkService.getAllSocialMediaLinks();
//   const language = req.language;

//   const formattedLinks = socialMediaLinks.map(doc => ({
//     socialMediaLink: doc[language]
//   }));

//   res.status(200).json({ status: 'success', data: formattedLinks });
// });
exports.getAllSocialMediaLinks = catchAsync(async (req, res) => {
  const socialMediaLinks = await SocialMediaLinkService.getAllSocialMediaLinks();
  const language = req.language;

  const formattedLinks = socialMediaLinks.map(doc => {
    if (doc[language]) {
      return {
        socialMediaLink: doc[language]
      };
    }
    return doc;
  });

  res.status(200).json({ status: 'success', data: formattedLinks });
});

exports.getSocialMediaLinkById = catchAsync(async (req, res) => {
  const socialMediaLink = await SocialMediaLinkService.getSocialMediaLinkById(req.params.id);
  if (!socialMediaLink) {
    return res.status(404).json({ status: 'error', message: 'Social Media Link not found' });
  }

  const language = req.language;
  const formattedLink = { socialMediaLink: socialMediaLink[language] };

  res.status(200).json({ status: 'success', data: formattedLink });
});

exports.updateSocialMediaLink = catchAsync(async (req, res) => {
  const socialMediaLink = await SocialMediaLinkService.updateSocialMediaLink(req.params.id, req.body);
  if (!socialMediaLink) {
    return res.status(404).json({ status: 'error', message: 'Social Media Link not found' });
  }
  res.status(200).json({ status: 'success', data: socialMediaLink });
});

exports.deleteSocialMediaLink = catchAsync(async (req, res) => {
  const socialMediaLink = await SocialMediaLinkService.deleteSocialMediaLink(req.params.id);
  if (!socialMediaLink) {
    return res.status(404).json({ status: 'error', message: 'Social Media Link not found' });
  }
  res.status(204).json({ status: 'success', data: null });
});
