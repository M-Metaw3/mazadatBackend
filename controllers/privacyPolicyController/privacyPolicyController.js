const PrivacyPolicyService = require('./privacyPolicyService');
const catchAsync = require('../../utils/catchAsync');

exports.createPrivacyPolicy = catchAsync(async (req, res) => {
  const privacyPolicy = await PrivacyPolicyService.createPrivacyPolicy(req.body);
  res.status(201).json({ status: 'success', data: privacyPolicy });
});

// exports.getAllPrivacyPolicies = catchAsync(async (req, res) => {
//   const privacyPolicies = await PrivacyPolicyService.getAllPrivacyPolicies();
//   const language = req.language;

//   const formattedPolicies = privacyPolicies.map(doc => ({
//     privacyPolicy: doc[language]
//   }));

//   res.status(200).json({ status: 'success', data: formattedPolicies });
// });
exports.getAllPrivacyPolicies = catchAsync(async (req, res) => {
  const privacyPolicies = await PrivacyPolicyService.getAllPrivacyPolicies();
  const language = req.language;

  const formattedPolicies = privacyPolicies.map(doc => {
    if (doc[language]) {
      return {
        privacyPolicy: doc[language]
      };
    }
    return doc;
  });

  res.status(200).json({ status: 'success', data: formattedPolicies });
});


exports.getPrivacyPolicyById = catchAsync(async (req, res) => {
  const privacyPolicy = await PrivacyPolicyService.getPrivacyPolicyById(req.params.id);
  if (!privacyPolicy) {
    return res.status(404).json({ status: 'error', message: 'Privacy policy not found' });
  }

  const language = req.language;
  const formattedPolicy = { privacyPolicy: privacyPolicy[language] };

  res.status(200).json({ status: 'success', data: formattedPolicy });
});

exports.updatePrivacyPolicy = catchAsync(async (req, res) => {
  const privacyPolicy = await PrivacyPolicyService.updatePrivacyPolicy(req.params.id, req.body);
  if (!privacyPolicy) {
    return res.status(404).json({ status: 'error', message: 'Privacy policy not found' });
  }
  res.status(200).json({ status: 'success', data: privacyPolicy });
});

exports.deletePrivacyPolicy = catchAsync(async (req, res) => {
  const privacyPolicy = await PrivacyPolicyService.deletePrivacyPolicy(req.params.id);
  if (!privacyPolicy) {
    return res.status(404).json({ status: 'error', message: 'Privacy policy not found' });
  }
  res.status(204).json({ status: 'success', data: null });
});
