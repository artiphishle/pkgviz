program TaskManager;

uses
  Vcl.Forms,
  MainForm in 'src\MainForm.pas' {FormMain},
  Models.Task in 'src\Models\Task.pas',
  Models.User in 'src\Models\User.pas',
  Models.Project in 'src\Models\Project.pas',
  Models.Comment in 'src\Models\Comment.pas',
  Services.TaskService in 'src\Services\TaskService.pas',
  Services.UserService in 'src\Services\UserService.pas',
  Services.ProjectService in 'src\Services\ProjectService.pas',
  Services.AuthService in 'src\Services\AuthService.pas',
  Database.Connection in 'src\Database\Connection.pas',
  Database.TaskRepository in 'src\Database\TaskRepository.pas',
  Database.UserRepository in 'src\Database\UserRepository.pas',
  Database.ProjectRepository in 'src\Database\ProjectRepository.pas',
  Utils.Logger in 'src\Utils\Logger.pas',
  Utils.StringUtils in 'src\Utils\StringUtils.pas',
  Utils.DateUtils in 'src\Utils\DateUtils.pas',
  Utils.Validator in 'src\Utils\Validator.pas',
  Controllers.TaskController in 'src\Controllers\TaskController.pas',
  Controllers.UserController in 'src\Controllers\UserController.pas',
  Controllers.ProjectController in 'src\Controllers\ProjectController.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TFormMain, FormMain);
  Application.Run;
end.
